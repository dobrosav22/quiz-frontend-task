import React, { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, TextField, Stack, Switch, FormControlLabel, Typography, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';

/**A question form component for handling the input of
 * new questions, as well as re-using the old ones.
 */
function QuestionForm(props) {

    const { options, onSubmit } = props;

    /**A toggler value for either displaying the new 
     * existing question form.
     */
    const [newQuestion, setNewQuestion] = useState(true)

    /**We keep this state as the autocomplete value to be dispatched to the 
    * parent component on Add existing question button click.
    */
    const [currentQuestion, setCurrentQuestion] = useState(null)

    /**A validator schema for the question object. */
    const questionSchema = yup.object().shape({
        question: yup.string().required('Question is required'),
        answer: yup.string().required('Answer is required'),
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(questionSchema)
    });

    /**A submit function dispatching the question object to the parent
     * component and clearing the inputs for new data to be added.
     */
    const onSubmitClick = (data) => {
        onSubmit(data)
        setCurrentQuestion(null)
        reset();
    }

    /**A handler for the switch component. */
    const onFormControlChange = (e) => {
        setNewQuestion(e.target.checked)
    }

    /**Handler function for the Autocomplete component change. */
    const onAutocompleteChange = (e, value) => {
        setCurrentQuestion(value)
    }

    /**Overriding the default comparison of the autocomplete input. */
    const autocompleteCompareValue = (option, value) => option.label === value.label

    /**Generating the options object for the Autocomplete */
    function generateOptions(options) {
        return options?.map(item => (
            {
                label: item.question,
                value: item
            }))
    }

    const autocompleteOptions = generateOptions(options ?? [])

    return (
        <Stack spacing={5}>
            <FormControlLabel
                control={
                    <Switch
                        checked={newQuestion}
                        onChange={onFormControlChange}
                    />
                }
                label="New question"
            />
            {newQuestion ?
                <form
                    onSubmit={handleSubmit(onSubmitClick)}
                >
                    <Stack spacing={5}>
                        <TextField
                            label='Question'
                            {...register('question')}
                            error={Boolean(errors.question)}
                            helperText={errors.question?.message}
                        />
                        <TextField
                            label='Answer'
                            {...register('answer')}
                            error={Boolean(errors.answer)}
                            helperText={errors.answer?.message}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            Save new question
                        </Button>
                    </Stack>
                </form>
                :
                <Stack spacing={5}>
                    <Autocomplete
                        disablePortal
                        options={autocompleteOptions}
                        value={currentQuestion}
                        sx={{ width: '100%' }}
                        onChange={onAutocompleteChange}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Choose a question"
                            />
                        }
                        isOptionEqualToValue={autocompleteCompareValue}
                    />
                    <Typography>
                        {currentQuestion &&
                            <>
                                <b>Answer: </b>
                                {currentQuestion?.value?.answer}
                            </>
                        }
                    </Typography>
                    <Button
                        disabled={!currentQuestion}
                        variant="contained"
                        onClick={() => onSubmitClick(currentQuestion.value)}>
                        Add existing question
                    </Button>
                </Stack>
            }
        </Stack>
    );
};

export default QuestionForm;

QuestionForm.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape(
            {
                label: PropTypes.string,
                value: PropTypes.shape(
                    {
                        question: PropTypes.string,
                        answer: PropTypes.string,
                        id: PropTypes.oneOfType([
                            PropTypes.string,
                            PropTypes.number
                        ])
                    }
                )
            }
        )
    ),
    onSave: PropTypes.func
}