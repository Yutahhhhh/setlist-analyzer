# frozen_string_literal: true

class TrackUploader < CommonUploader
  EXTENSION_ALLOWLIST = %w[jpg jpeg gif png].freeze

  def extension_allowlist
    EXTENSION_ALLOWLIST
  end
end
