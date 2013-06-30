class Role < ActiveRecord::Base
  validates :name, :status_id, presence: true
  validates :name, uniqueness: true

  belongs_to :status
end
