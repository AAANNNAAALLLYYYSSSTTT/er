require 'test_helper'

class ApiControllerTest < ActionController::TestCase
  test "should get get_records_for_date" do
    get :get_records_for_date
    assert_response :success
  end

end
