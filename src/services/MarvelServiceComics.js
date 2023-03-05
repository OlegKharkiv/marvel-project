import { useHttp } from "../Hooks/http.hook";

const useMarvelServiceComics = () => {
    const {request, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=1e6e60cdb5f18b80a4394bd3932e5f79';
    // const _baseOffset = 210;


    const getAllComics = async (offset) => {
        const res = await request(`${_apiBase}comics?format=comic&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    };

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    };

    const _transformComics = (comic) => {
        return {
                id: comic.id,
                title: comic.title,
                description: comic.description || 'There is no description',
                pageCount: comic.pageCount ? `${comic.pageCount} p.` : 'No information about the number of pages',
                language: comic.textObjects.language || 'en-us',
                thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
                price: comic.prices[0].price ? `${comic.prices[0].price}$` : "NOT AVAILABLE",
                homepage: comic.urls[0].url,
        };
    };
    

    return {process,
            setProcess, 
            getAllComics, 
            getComic, 
            clearError};
}

export default useMarvelServiceComics;