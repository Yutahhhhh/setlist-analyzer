# frozen_string_literal: true

# NOTE: only doing this in development as some production environments (Heroku)
# NOTE: are sensitive to local FS writes, and besides -- it's just not proper
# NOTE: to have a dev-mode tool do its thing in production.
# if Rails.env.development?
#   RailsERD.load_tasks
# end

# see https://qiita.com/shou8/items/59d85709829b673d7a96
if Rails.env.development?
  RailsERD.load_tasks

  module ERDGraph
    class Migration
      def self.update_model
        Zeitwerk::Loader.eager_load_all
        Rake::Task['erd'].invoke
      end
    end
  end
end
