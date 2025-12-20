export const imageService = {
    getMovieImage(title: string){
        const imageName = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        return `/images/movies/${imageName}.jpg`;
    }
};