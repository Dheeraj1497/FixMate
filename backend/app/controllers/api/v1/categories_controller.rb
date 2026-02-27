class Api::V1::CategoriesController < ApplicationController
  def index
    render json: Category.includes(:services).as_json(include: :services)
  end
end