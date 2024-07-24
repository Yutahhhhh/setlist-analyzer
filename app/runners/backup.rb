# frozen_string_literal: true

# bundle exec rails r Backup.apply

require 'csv'

class Backup
  BACKUP_DIR = 'backups'
  TARGET_MODELS = [Track, User, TrackPhrase, Setlist, SetlistTrack].freeze

  def self.apply
    TARGET_MODELS.each do |model|
      table_name = model.table_name
      file_name = "#{BACKUP_DIR}/#{table_name}.csv"
      CSV.open(file_name, 'w') do |csv|
        columns = model.column_names
        csv << columns
        model.find_each do |record|
          csv << record.attributes.values
        end
      end
    end
  end
end
