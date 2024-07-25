# frozen_string_literal: true

require 'zip'

class AudiosController < ApplicationController
  def find_audio
    full_path = AudioUtil.target_path(params.require(:path))

    return render json: { error: 'File not found' }, status: :not_found unless File.exist?(full_path)

    send_file full_path, type: 'audio/mpeg', disposition: 'inline'
  end

  def download
    files = download_params[:files].select { |path| File.exist?(path) }
    return render json: { error: 'No files found' }, status: :not_found if files.empty?

    zipfile_name = "Tracks-#{Time.current.strftime('%Y%m%d%H%M%S')}.zip"
    temp_file = Tempfile.new(zipfile_name)
    begin
      Zip::File.open(temp_file.path, Zip::File::CREATE) do |zipfile|
        files.each do |file|
          zipfile.add(File.basename(file), file)
        end
      end

      send_data File.read(temp_file.path), type: 'application/zip', disposition: 'attachment', filename: zipfile_name
    ensure
      temp_file.close
      temp_file.unlink
    end
  end

  private

  def download_params
    params.permit(files: [])
  end
end
