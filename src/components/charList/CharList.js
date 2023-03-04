import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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

    const onCharListLoaded = async (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList([...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset(offset + 9);
        setCharEnded(ended);
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
            
            
            return (
                    <CSSTransition key={item.id} timeout={600} classNames='char__item'>
                        <li 
                            ref={el => myLiRef.current[index] = el}
                            className={'char__item'}
                            onClick={() => {
                                props.onCharSelected(item.id);
                                focusLI(index);
                            }}
                            tabIndex={0}
                            key={index}
                            onKeyPress={(e) => {
                                if (e.key === ' ' || e.key === "Enter") {
                                    props.onCharSelected(item.id);
                                    focusLI(index);
                                }
                            }}>
                                <img src={item.thumbnail} alt={item.name} style={styleThumbnail}/>
                                <div className="char__name">{item.name}</div>
                        </li>
                    </CSSTransition> 
            )
        });
        
        return (
                <ul className="char__grid">
                    <TransitionGroup component={null}>
                        {items}
                    </TransitionGroup>
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
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;