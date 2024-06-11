# frozen_string_literal: true

class AudioGenreTrainJobStatusBlueprint < JobStatusBlueprint
  field :train_data do |job_status|
    WorkerGenreService.get_genres(job_status.user_id)
  end
end
