import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; 

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from '../appBanner/AppBanner';
import './SingleCharByName.scss';

const SingleCharByNamePage = () => {
    let {charByNameId} = useParams();
    const [charByName, setCharByName] = useState();
    const {loading, error, getCharacterByNameTR, clearError} = useMarvelService();


    useEffect(() => {
        updateChar();
    }, [charByNameId]);

    const updateChar = () => {
        clearError();
        
        getCharacterByNameTR(charByNameId)
            .then(onCharByNameLoaded)
    }

    const onCharByNameLoaded = (charByName) => {
        setCharByName(charByName);
    }
     
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !charByName) ? <View charByName={charByName}/> : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({charByName}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = charByName;

    return(
        <>
            <div className="charByName">
                <img src={thumbnail} alt={name} className="charByName__img"/>
                <div className="charByName__info">
                    <h2 className="charByName__name">{name}</h2>
                    <p className="charByName__descr">{description}</p>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                        <a href={comics} className="button button__secondary">
                            <div className="inner">Comics</div>
                        </a>
                    </div>
                </div>
                <Link to="/" className="charByName__back">Back to main page</Link>
            </div>
        </>
    )
}
export default SingleCharByNamePage; 