import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ContentContainer from 'components/content-container/content-container';
import { TextField, Stack, Button, IconButton, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material'
import { getAllQuestions, getQuizById, updateQuiz } from 'api/endpoints';
import { useQuery, useQueryClient } from 'react-query';
import QuestionForm from 'components/question-form/question-form';
import { DataGrid } from '@mui/x-data-grid';
import { createQuiz } from 'api/endpoints';

/**A quiz form page for either creating a 
 * new quiz of editing an existing one.
 */
function QuizFormPage() {

    const queryClient = useQueryClient();
    const navigate = useNavigate()
    const [message, setMessage] = useState()

    /**The id parameter can either be 'new' or an actuall id. */
    const { id } = useParams();

    /**Based on the id value, we differentiate between handlers
     * and titles for creating an new quiz or updating one.
     */
    const isNewQuizForm = id === 'new'

    const initialData = {
        name: '',
        questions: []
    }

    const {
        isLoading: questionsLoading,
        error: questionsError,
        data: questionsData
    } = useQuery(
        'questions',
        () => getAllQuestions()
    );

    const {
        isLoading: quizLoading,
        error: quizError,
        data: quizData
    } = useQuery(
        `quiz-${id}`,
        () => getQuizById(id),
        { enabled: !isNewQuizForm }
    );

    /**We have two querries, so once both are done loading we pass
     * the isLoading to the container that will then show an error
     * message if one exists.
     */
    const isLoading = questionsLoading || quizLoading;

    const [error, setError] = useState(null)

    /**Just in case there is an error, we merge the two request errors
     * and send it in a similar shape to others, to pass the validation.
     */
    useEffect(() => {
        if (!isLoading) {
            if (quizError || questionsError) {
                setError(
                    {
                        message: `${quizError && quizError?.message} 
                        ${questionsError && questionsError?.message}`
                    }
                )
            }
        }
    }, [isLoading, quizError,questionsError])

    const [payloadData, setPayloadData] = useState(initialData)

    useEffect(() => {
        if (quizData) {
            setPayloadData(quizData)
        }
    }, [quizData])

    const buttonProps = {
        text: 'Back to all Quizzes',
        onClick: () => navigate('/')
    }

    /**In the questions list, we can remove questions, this
     * handler is passed to a delete button to filter out
     * the question with the passed id.
     */
    const onDeleteClick = (id) => {
        const { questions } = payloadData
        setPayloadData(
            {
                ...payloadData,
                questions: questions
                    .filter(item => item.id !== id)
            })
        setMessage('Question removed.')
    }

    /**If we want to add questions, then we use this handler, and 
     * based on whether the question is new or added from the existing
     * ones, we either pass the actuall id or create a custom one.
     * The id is needed so we can track and filter them out from our array.
     */
    const onSubmit = (data) => {
        const { questions } = payloadData;
        setPayloadData(
            {
                ...payloadData,
                questions:
                    [
                        ...questions,
                        {
                            ...data,
                            id: data.id
                                ?? `new-question-${questions.length}`
                        }
                    ]
            });
        setMessage('Question added.')
    }

    /**Once we decide to actually send our data to the server, we need to remove
     * the temporary ids we have on new questions, so the server can differentiate
     * them and know they are new questions to be added to the database.
     */
    function removeIDsFromNewQuestions(data) {

        const { questions } = data;

        const filteredQuestions = questions.map(
            ({ id, ...rest }) => {
                return isNaN(Number(id))
                    ? { ...rest }
                    : { id, ...rest };
            });

        return {
            ...data,
            questions: filteredQuestions
        };
    }

    /**The Save button click handler. We first check which request do we need to send. */
    const onSave = () => {
        if (isNewQuizForm)
            createQuiz(
                removeIDsFromNewQuestions(payloadData))
                .then(() => {
                    setMessage('Quiz succesfully created.')
                    setTimeout(() => {
                        navigate('/')
                    }, 3000);
                })
                .catch((error) => {
                    setMessage(error.message)
                })
        else
            updateQuiz(
                id,
                removeIDsFromNewQuestions(payloadData))
                .then(() => {
                    setMessage('Quiz succesfully updated.')
                    setTimeout(() => {
                        queryClient.invalidateQueries(`quiz-${id}`);
                        navigate('/')
                    }, 3000);
                })
                .catch((error) => {
                    setMessage(error.message)
                })
    }

    /**Columns for the DataGrid, with the delete icon render 
     * stored directly in the renderCell prop.
     */
    const columns = [
        {
            field: 'question',
            headerName: 'Question',
            flex: 0.6,
            hideSortIcons: true,
            disableColumnMenu: true
        },
        {
            field: 'answer',
            headerName: 'Answer',
            flex: 0.3,
            hideSortIcons: true,
            disableColumnMenu: true,
        },
        {
            field: 'delete',
            headerName: '',
            flex: 0.1,
            renderCell: (params) => (
                <IconButton
                    onClick={() => onDeleteClick(params.row.id)}
                >
                    <Delete />
                </IconButton>
            ),
            hideSortIcons: true,
            disableColumnMenu: true,
        },
    ]

    return (
        <ContentContainer
            title={
                isNewQuizForm
                    ? 'Create a new Quiz'
                    : `Edit ${quizData?.name ?? 'quiz'}`
            }
            buttonProps={buttonProps}
            message={message}
            setMessage={setMessage}
            isLoading={isLoading}
            error={error}
        >
            <Stack spacing={5}>
                <Stack
                    direction={
                        {
                            md: 'row',
                            sm: 'column'
                        }}
                    gap={5}
                    justifyContent={'space-between'}
                >
                    <TextField
                        label='Quiz name'
                        value={payloadData?.name}
                        onChange={(e) => {
                            setPayloadData(
                                {
                                    ...payloadData,
                                    name: e.target.value
                                }
                            )
                        }}
                        sx={{ width: '100%' }}
                    />
                    <Button
                        variant='contained'
                        fullWidth
                        onClick={onSave}
                    >
                        Save
                    </Button>
                </Stack>
                <QuestionForm
                    options={questionsData}
                    onSubmit={onSubmit}
                />
                <Typography variant='h5'>
                    Questions
                </Typography>
                <DataGrid
                    columns={columns}
                    rows={payloadData.questions}
                    autoHeight
                    hideFooter
                />
            </Stack>
        </ContentContainer>
    )
};

export default QuizFormPage