# frozen_string_literal: true

require 'taglib'

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

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/MethodLength
  def self.get_metadata(path)
    metadata = {}
    ext = File.extname(path).downcase
    audio_mime_type = EXTENSION_TO_MIME_TYPE_MAP[ext]

    case ext
    when '.mp3', '.wav'
      TagLib::MPEG::File.open(path) do |file|
        tag = file.id3v2_tag
        metadata.merge!(extract_common_metadata(tag, audio_mime_type)) if tag
        metadata.merge!(extract_artwork(file)) if tag
      end
    when '.flac'
      TagLib::FLAC::File.open(path) do |file|
        tag = file.xiph_comment
        metadata.merge!(extract_common_metadata(tag, audio_mime_type)) if tag
        metadata.merge!(extract_flac_artwork(file))
      end
    else
      TagLib::FileRef.open(path) do |fileref|
        unless fileref.null?
          tag = fileref.tag
          metadata.merge!(extract_common_metadata(tag, audio_mime_type)) if tag
        end
      end
    end

    metadata
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/MethodLength

  def self.read_audio_directory(filename: nil, extensions: nil, exclude_paths: [])
    all_files = Dir.glob(File.join(ROOT_DIR, '**', '*'))
                   .select { |file| EXTENSION_TO_MIME_TYPE_MAP.key?(File.extname(file).downcase) }
                   .reject { |file| exclude_paths.include?(file) }

    all_files = filter_by_filename(all_files, filename)
    filter_by_extensions(all_files, extensions)
  end

  def self.extract_common_metadata(tag, audio_mime_type)
    {
      title: tag.title,
      artist: tag.artist,
      album: tag.album,
      genre: tag.genre,
      year: tag.year.to_s,
      audio_mime_type:
    }
  end

  def self.extract_artwork(file)
    artwork = {}
    tag = file.id3v2_tag
    cover = tag.frame_list('APIC').first
    if cover
      artwork[:cover_mime_type] = cover.mime_type
      artwork[:cover_image] = cover.mime_type ? to_uri(cover.mime_type, Base64.encode64(cover.picture)) : nil
    end
    artwork
  end

  def self.extract_flac_artwork(file)
    artwork = {}
    unless file.picture_list.empty?
      picture = file.picture_list.first
      artwork[:cover_mime_type] = picture.mime_type
      artwork[:cover_image] = picture.mime_type ? to_uri(picture.mime_type, Base64.encode64(picture.data)) : nil
    end
    artwork
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
