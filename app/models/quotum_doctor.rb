class QuotumDoctor < ActiveRecord::Base
  validates :full, :currently, :doctor_id, :post_id, :year, :month, :day, :status_id, presence: true

  belongs_to :doctor
  belongs_to :post
  belongs_to :status
end
