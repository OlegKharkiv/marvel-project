import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelServiceComics from '../../services/MarvelServiceComics';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = (props) => {
    const [comicList, setComicList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicEnded, setComicEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelServiceComics();

    useEffect(() => {
        onRequest(offset, true);
    }, [])
    
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicListLoaded)
    }

    const onComicListLoaded = (newComicList) => {
        let ended = false;
        if (newComicList.length < 8) {
            ended = true;
        }

        setComicList(comicList => [...comicList, ...newComicList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicEnded(comicEnded => ended);
    }

    function renderItems(arr) {
        const items =  arr.map((item, index) => {
            // const styleThumbnail = (item.thumbnail === ('http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg')) ? {objectFit: 'contain'} : {objectFit: 'cover'};
            
            return (
                <li className="comics__item"
                    tabIndex={index}
                    key={index}>
                    <a href={item.homepage}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
                </li>
            )
        });
        
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
        
        const items = renderItems(comicList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !newItemLoading ? <Spinner/> : null;

        return (
            <div className="comics__list">
                {errorMessage}
                {spinner}
                {items}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': comicEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )

    ComicsList.propTypes = {
        onComicsSelected: PropTypes.func.isRequired
    }
}

export default ComicsList; 
