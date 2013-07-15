class Status < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true, length: { minimum: 2 }

  has_many :posts
  has_many :doctors
  has_many :roles
  has_many :accounts
  has_many :quotum_doctors

  TYPES = %w{ on none off }

  TYPES.each_with_index do |item, index|
    define_singleton_method("#{item}") { Status.find_by_id(index+1) }
  end

end
