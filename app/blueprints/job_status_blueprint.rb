# frozen_string_literal: true

class JobStatusBlueprint < Blueprinter::Base
  identifier :id
  fields :job_type,
         :status,
         :job_id,
         :user_id,
         :message,
         :progress,
         :result,
         :retry_count,
         :started_at,
         :finished_at,
         :created_at,
         :updated_at
end
