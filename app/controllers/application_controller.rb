class ApplicationController < ActionController::API
  include ActionController::Cookies
  def frontend
    render file: Rails.public_path.join("index.html"), layout: false
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
end
