# frozen_string_literal: true

class AudiosController < ApplicationController
  def find_audio
    full_path = AudioUtil.target_path(params.require(:path))

    return render json: { error: 'File not found' }, status: :not_found unless File.exist?(full_path)

    send_file full_path, type: 'audio/mpeg', disposition: 'inline'
  end
end
