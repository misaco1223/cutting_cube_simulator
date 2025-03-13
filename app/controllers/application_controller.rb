class ApplicationController < ActionController::API
  include ActionController::Cookies
  def frontend
    render file: Rails.public_path.join("index.html"), layout: false
  end
end
