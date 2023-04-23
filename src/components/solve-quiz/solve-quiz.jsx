import { getQuizById } from 'api/endpoints';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from 'react-query';
import ContentContainer from 'components/content-container/content-container';
import QuestionCard from 'components/question-card/question-card';

/**The SolveQuiz page, where we retreive the quiz 
 * data and allow the user to go through the questions.
 */
function SolveQuizPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState();

    const {
        isLoading,
        error,
        data
    } = useQuery(
        `quiz-${id}`,
        () => getQuizById(id)
    );

    const buttonProps = {
        text: 'Back to all Quizzes',
        onClick: () => navigate('/')
    };

    return (
        <ContentContainer
            title={data?.name}
            buttonProps={buttonProps}
            message={message}
            setMessage={setMessage}
            isLoading={isLoading}
            error={error}
        >
            <QuestionCard questions={data?.questions??[]} />
        </ContentContainer>
    )
};

export default SolveQuizPage;