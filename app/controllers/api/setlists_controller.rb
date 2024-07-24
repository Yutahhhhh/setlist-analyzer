# frozen_string_literal: true

module Api
  class SetlistsController < Api::ApplicationController
    before_action :set_setlist, only: %i[update destroy show]

    def index
      setlists = current_user.setlists.eager_load(tracks: :setlist_tracks)
      render json: SetlistBlueprint.render(setlists)
    end

    def show
      render json: SetlistBlueprint.render(@setlist)
    end

    def create
      setlist = current_user.setlists.build(create_setlist_params)
      if setlist.save
        render json: SetlistBlueprint.render(setlist), status: :ok
      else
        render_validation_error(setlist)
      end
    end

    def update
      ActiveRecord::Base.transaction do
        @setlist.setlist_tracks.destroy_all
        if @setlist.update(update_setlist_params)
          render json: SetlistBlueprint.render(@setlist)
        else
          render_validation_error(@setlist)
          raise ActiveRecord::Rollback
        end
      end
    end

    def destroy
      @setlist.destroy
      render json: {}, status: :ok
    end

    private

    def set_setlist
      @setlist = current_user.setlists.eager_load(tracks: :setlist_tracks).find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Setlist not found' }, status: :not_found
    end

    def create_setlist_params
      params.require(:setlist).permit(:name, :genre_name, :rating,
                                      setlist_tracks_attributes: %i[track_id play_order])
    end

    def update_setlist_params
      params.require(:setlist).permit(:id, :name, :genre_name, :rating,
                                      setlist_tracks_attributes: %i[track_id play_order])
    end
  end
end
