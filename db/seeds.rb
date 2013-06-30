# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

def setup_statuses
  Status.delete_all
  File.readlines(Rails.root.join('do', 'export', 'to', 'db', 'files','statuses.txt')).each do |line|
    name, description = line.chomp.split("|")
    Status.create!(name: name, description: description)
  end
end
#setup_statuses

def setup_flags
  Flag.delete_all
  File.readlines(Rails.root.join('do', 'export', 'to', 'db', 'files','flags.txt')).each do |line|
    name, description = line.chomp.split("|")
    Flag.create!(name: name, description: description)
  end
end
#setup_flags
