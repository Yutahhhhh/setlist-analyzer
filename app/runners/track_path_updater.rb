# frozen_string_literal: true

# bin/rails r "TrackPathUpdater.apply(clean_up: true)"

class TrackPathUpdater
  def self.apply(options = {})
    new(options).apply
  end

  def initialize(options = {})
    @options = options
  end

  def apply
    # 全オーディオファイルを取得
    audio_files = AudioUtil.read_audio_directory
    existing_paths = audio_files.to_set
    audio_files.each do |file_path|
      md5 = calculate_md5(file_path)
      next unless md5

      # MD5が一致するTrackのpathを更新
      Track.where(md5:).find_each do |track|
        track.update(path: file_path)
        Rails.logger.info("Updated track #{track.id} path to #{file_path}")
      end
    end

    delete_tracks(existing_paths) if @options[:clean_up]
  end

  def delete_tracks(existing_paths)
    Track.find_each do |track|
      unless existing_paths.include?(track.path)
        track.destroy
        Rails.logger.info("Removed track #{track.id} with non-existent path #{track.path}")
      end
    end
  end

  private

  def calculate_md5(file_path)
    Digest::MD5.file(file_path).hexdigest
  rescue StandardError => e
    Rails.logger.error("Failed to calculate MD5 for file: #{file_path}, error: #{e}")
    nil
  end
end
