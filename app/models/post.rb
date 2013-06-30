class Post < ActiveRecord::Base
  validates :name, :status_id, presence: true
  validates :name, uniqueness: true

  belongs_to :status
  has_many :doctors
  has_many :quotum_doctors
end
