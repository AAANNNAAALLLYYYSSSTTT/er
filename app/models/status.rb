class Status < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true, length: { minimum: 2 }

  has_many :posts
  has_many :doctors
  has_many :roles
  has_many :accounts
  has_many :quotum_doctors
end
