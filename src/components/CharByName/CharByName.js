import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import {Link} from 'react-router-dom';
import * as Yup from 'yup';

import useMarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/ErrorMessage';

import './CharByName.scss';

const CharByName = () => {
    const [char, setChar] = useState(null);
    const {loading, error, getCharacterByName, clearError} = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
            .then(onCharLoaded);
    }


    const errorMessage = error ? <div className='charByName__search-critical-error'><ErrorMessage/></div> : null;
    const results = !char ? null : char.length > 0 ?
                    <div className='charByName__search-wrapper'>
                        <div className='charByName__search-success'>There is! Visit {char[0].name} page?</div>
                        <Link to={`/characters/${char[0].id}`} className='button button__secondary'>
                            <div className='inner'>To page</div>
                        </Link>
                    </div> :
                    <div className='charByName__search-error'>
                        The character was not found. Check the name and try again
                    </div>;

    return (
        <div className='charByName__search-form'>
            <Formik
                initialValues={{
                    charName: ''
                }}
                validationSchema={Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit={({charName}) => {updateChar(charName)}}
            >
                <Form>
                    <label className='charByName__search-label' htmlFor='charName'>Or find character by name:</label>
                    <div className='charByName__search-wrapper'>
                        <Field
                            id="charName"
                            name="charName"
                            type="text"
                            placeholder="Type a character name"
                        />
                        <button className="button button__main" 
                                type="submit"
                                disabled={loading}>
                            <div className="inner">Find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className='charByName__search-error' name="charName" />
                </Form>
            </Formik>
            {results}
            {errorMessage}
        </div>
    )
}

export default CharByName;