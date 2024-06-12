# frozen_string_literal: true

module AudioUtil
  ROOT_DIR = Rails.application.config.audio_base_dir
  EXTENSION_TO_MIME_TYPE_MAP = {
    '.mp3' => 'audio/mpeg',
    '.wav' => 'audio/wav',
    '.flac' => 'audio/flac',
    '.ogg' => 'audio/ogg'
  }.freeze

  def self.target_path(path = nil)
    path || ROOT_DIR
  end

  def self.read_audio_directory(filename: nil, extensions: nil, exclude_paths: [])
    all_files = Dir.glob(File.join(ROOT_DIR, '**', '*'))
                   .select { |file| EXTENSION_TO_MIME_TYPE_MAP.key?(File.extname(file).downcase) }
                   .reject { |file| exclude_paths.include?(file) }

    all_files = filter_by_filename(all_files, filename)
    filter_by_extensions(all_files, extensions)
  end

  def self.to_uri(mime_type, encode64)
    "data:#{mime_type};base64,#{encode64}"
  end

  def self.filter_by_filename(files, filename)
    return files if filename.blank?

    files.select { |file| file.downcase.include?(filename.downcase) }
  end

  def self.filter_by_extensions(files, extensions)
    return files if extensions.blank?

    extensions = extensions.split(',') if extensions.is_a?(String)
    files.select { |file| extensions.include?(File.extname(file).downcase) }
  end
end
