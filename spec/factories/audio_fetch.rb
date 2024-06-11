# frozen_string_literal: true

require 'fileutils'

FactoryBot.define do
  factory :audio_fetch, class: 'Hash' do
    skip_create
    # sampleにはtest.mp3, test.m4a, test.wav, test.flacがそれぞれある
    sample_dir { Rails.root.join('spec/fixtures/sample') }
    base_dir { Pathname.new(Rails.application.config.audio_base_dir) }

    trait :custom_files do
      # テスト後にファイルを削除する
      # copied_files.values.each do |filepath|
      #   FileUtils.rm(filepath) if File.exist?(filepath)
      # end

      transient do
        file_specs { [] }
      end

      initialize_with do
        file_specs.map do |file_spec|
          source_file = Dir[sample_dir.join("*.#{file_spec[:ext]}")].first

          raise "No source files with extension #{file_spec[:ext]} found in sample directory." unless source_file

          destination_filename = "#{file_spec[:path]}.#{file_spec[:ext]}"
          destination = base_dir.join(destination_filename)
          FileUtils.cp(source_file, destination)

          { destination_filename => destination.to_s }
        end.reduce(:merge)
      end
    end

    trait :add do
      initialize_with do
        source_file = Dir[sample_dir.join('*.mp3')].first

        raise 'No source files with extension mp3 found in sample directory.' unless source_file

        destination_filename = 'test.mp3'
        destination = base_dir.join(destination_filename)
        FileUtils.cp(source_file, destination)

        { destination_filename => destination.to_s }
      end
    end
  end
end
