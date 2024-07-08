# frozen_string_literal: true

# bundle exec rails r Restore.apply

require 'csv'
require 'active_record'

class Restore
  BACKUP_DIR = 'backups'

  def self.apply
    ActiveRecord::Base.transaction do
      user_id = User.first.id
      create_tracks!(user_id)
      create_track_phrases!
    end
  end

  def self.create_tracks!(user_id)
    CSV.foreach("#{BACKUP_DIR}/tracks.csv", headers: true) do |row|
      row['user_id'] = user_id
      Track.create!(row)
    end
  end

  def self.create_track_phrases!
    CSV.foreach("#{BACKUP_DIR}/track_phrases.csv", headers: true) do |row|
      TrackPhrase.create!(row)
    end
  end
end
