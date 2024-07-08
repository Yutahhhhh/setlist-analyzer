# frozen_string_literal: true

# bundle exec rails r TrackCleanup.apply

require 'csv'

class Backup
  def self.apply
    tables = ActiveRecord::Base.connection.tables

    tables.each do |table_name|
      file_name = "#{table_name}.csv"
      CSV.open(file_name, 'w') do |csv|
        columns = ActiveRecord::Base.connection.columns(table_name).map(&:name)
        csv << columns
        rows = ActiveRecord::Base.connection.select_all("SELECT * FROM #{table_name}")
        rows.each do |row|
          csv << row.values
        end
      end
    end
  end
end
