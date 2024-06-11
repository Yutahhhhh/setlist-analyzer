# frozen_string_literal: true

class CommonUploader < CarrierWave::Uploader::Base
  include CarrierWave::Vips

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end
end
