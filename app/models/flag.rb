class Flag < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true, length: { minimum: 2 }

  has_many :records

  TYPES = %w{ accepted awaiting rejected }

  TYPES.each_with_index do |item, index|
    define_singleton_method("#{item}") { Flag.find_by_id(index+1) }
  end

end
