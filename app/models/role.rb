class Role < ActiveRecord::Base
  validates :name, :status_id, presence: true
  validates :name, uniqueness: true

  belongs_to :status
  has_many :accounts

  TYPES = %w{ admin user receptionist }

  TYPES.each_with_index do |item, index|
    define_singleton_method("#{item}") { Role.find_by_id(index+1) }
  end

end
