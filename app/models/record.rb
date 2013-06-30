class Record < ActiveRecord::Base
  validates :account_id, :surname, :name, :card, :doctor_id, :year, :month, :day, :flag_id, presence: true

  belongs_to :account
  belongs_to :doctor
  belongs_to :flag
end
