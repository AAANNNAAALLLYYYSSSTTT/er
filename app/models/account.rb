class Account < ActiveRecord::Base
  validates :name, :role_id, :status_id, presence: true
  validates :name, uniqueness: true, case_sensitive: false

  has_secure_password

  belongs_to :role
  belongs_to :status
  has_many :records

  GENERAL_RECEPTIONIST_ID = 84

end
