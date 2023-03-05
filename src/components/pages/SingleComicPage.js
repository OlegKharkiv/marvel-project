
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet"; 

import useMarvelServiceComics from '../../services/MarvelServiceComics';
import setContent from '../../utils/setContent';
import AppBanner from '../appBanner/AppBanner';
import './SingleComicPage.scss';

const SingleComicPage = () => {
    let {comicId} = useParams();
    const [comic, setComic] = useState();
    const {getComic, clearError, process, setProcess} = useMarvelServiceComics();


    useEffect(() => {
        updateComic();
    }, [comicId]);

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }
     
    
    return (
        <>
            <AppBanner/>
            {setContent(process, View, comic)}
        </>
    )
}

const View = ({data}) => {
    const {title, description, pageCount, language, thumbnail, price} = data;

    return(
        <>
            <div className="single-comic">
                <Helmet>
                    <meta
                        name="description"
                        content={`${title} comic book`}
                    />
                    <title>{title}</title>
                </Helmet>
                <img src={thumbnail} alt={title} className="single-comic__img"/>
                <div className="single-comic__info">
                    <h2 className="single-comic__name">{title}</h2>
                    <p className="single-comic__descr">{description}</p>
                    <p className="single-comic__descr">{pageCount}</p>
                    <p className="single-comic__descr">Language: {language}</p>
                    <div className="single-comic__price">{price}</div>
                </div>
                <Link to="/comics" className="single-comic__back">Back to all</Link>
            </div>
        </>
    )
}
export default SingleComicPage;