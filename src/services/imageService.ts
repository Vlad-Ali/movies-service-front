export const imageService = {
    getMovieImage(title: string){
        const imageName = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        return `/movies-service-front/images/movies/${imageName}.jpg`;
    }
};