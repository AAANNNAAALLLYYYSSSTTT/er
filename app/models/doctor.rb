class Doctor < ActiveRecord::Base
  validates :surname, :name, :post_id, :status_id, presence: true

  belongs_to :post
  belongs_to :status
  has_many :records
end
