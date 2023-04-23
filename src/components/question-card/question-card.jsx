import { Button, Typography, Stack, IconButton, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import PropTypes from 'prop-types';

/**Styling for the IconButton, since by defalut it 
 * fill the entire container width and height.
 */
const StyledIconButton = styled(IconButton)(() => ({
    height: '3rem',
    width: '3rem'
}));

const QuestionContainer = styled(Stack)(() => ({
    width: '100%'
}));

/**Question card component. It is used for displaying the question with the
 * answer that can be be shown/hidden on a button click. The component allows
 * the user to navigate through available questions with two buttons.
 */
function QuestionCard(props) {

    const { questions } = props;

    const [showAnswer, setShowAnswer] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    /**Every time we switch to another answer, the showAnswer 
     * should be set to false.
     */
    useEffect(() => {
        setShowAnswer(false)
    }, [currentQuestion]);

    /**Handlers for increasing and decreasing the question index. */
    const nextQuestion = () => {
        setCurrentQuestion(currentQuestion + 1)
    };

    const prevQuestion = () => {
        setCurrentQuestion(currentQuestion - 1)
    };

    const toggleAnswerVisibility = () => {
        setShowAnswer(!showAnswer)
    };

    return (
        <Stack
            direction='row'
            spacing={5}
            justifyContent='space-between'
            alignItems='top'
        >
            <StyledIconButton
                disabled={currentQuestion === 0}
                onClick={prevQuestion}
            >
                <ChevronLeft />
            </StyledIconButton>
            <QuestionContainer
                spacing={5}
            >
                <Typography
                    textAlign={'center'}
                    style={{ minHeight: '5rem' }}
                >
                    {questions?.[currentQuestion]?.question}
                </Typography>
                <Button
                    variant='contained'
                    onClick={toggleAnswerVisibility}
                >
                    {`${showAnswer ? 'Hide' : 'Show'} the answer`}
                </Button>
                {showAnswer &&
                    <Typography>
                        {questions?.[currentQuestion]?.answer}
                    </Typography>}
            </QuestionContainer>
            <StyledIconButton
                disabled={currentQuestion > (questions?.length - 2)}
                onClick={nextQuestion}
            >
                <ChevronRight />
            </StyledIconButton>
        </Stack>
    )
};

export default QuestionCard;

QuestionCard.propTypes = {
    /**Array of question objects. */
    questions: PropTypes.arrayOf(
        PropTypes.shape(
            {
                question: PropTypes.string,
                answer: PropTypes.string,
                id: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                ])
            }
        )
    ).isRequired
};
