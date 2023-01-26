import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';


const CharList = (props) => {
    
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])
    
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    
    const myLiRef = useRef([]);

    const focusLI = (id) => {
        myLiRef.current.forEach(item => item.classList.remove('char__item_selected'));
        myLiRef.current[id].classList.add('char__item_selected');
        myLiRef.current[id].focus();
    }

    function renderItems(arr) {
        const items =  arr.map((item, index) => {
            const styleThumbnail = (item.thumbnail === ('http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg')) ? {objectFit: 'contain'} : {objectFit: 'cover'};
            // let ID = "char__item" + index;
            // let FocusedItem = '';
            // if (this.setInputRef) {
            //     classNames += '_selected';
            // }
            
            
            return (
                <li 
                    ref={el => myLiRef.current[index] = el}
                    // className={FocusedItem === ID? "char__item char__item_selected" : "char__item"}
                    className={'char__item'}
                    // onMouseEnter={() => (FocusedItem = ID)}
                    // onMouseLeave={() => (FocusedItem = "")}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusLI(index);
                    }}
                    tabIndex={0}
                    key={item.id}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusLI(index);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={styleThumbnail}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
        
        const items = renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !newItemLoading ? <Spinner/> : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {items}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}
                    >
                    <div className="inner">load more</div>
                </button>
            </div>
        )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;