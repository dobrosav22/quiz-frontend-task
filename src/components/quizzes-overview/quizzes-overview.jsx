import { IconButton, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getAllQuizzes, deleteQuiz } from 'api/endpoints';
import { Delete, Edit, PsychologyAlt } from '@mui/icons-material'
import { useNavigate } from 'react-router';
import ContentContainer from 'components/content-container/content-container';

function QuizzesOverviewPage() {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    /**A message to be displayed in the Snackbar component. */
    const [message, setMessage] = useState('');

    /**We use the react-query hook for retreiving the data from our endpoints
     * along with the loading status and possible error object.
     */
    const {
        isLoading,
        error,
        data
    } = useQuery(
        'quizzes',
        getAllQuizzes
    );

    const columns = [
        {
            field: 'name',
            headerName: 'Quiz name',
            flex: 0.65,
            disableColumnMenu: true
        },
        {
            field: 'actions',
            headerName: '',
            flex: 0.35,
            renderCell: (params) => params.row.actions,
            hideSortIcons: true,
            disableColumnMenu: true,
            align: 'right'
        },
    ];

    /**The handler for the Delete button, triggering a 
     * delete request and handling the message to be shown.
    */
    const onDeleteClick = (item) => {
        deleteQuiz(item.id).then(() => {
            queryClient.invalidateQueries('quizzes');
            setMessage('Quiz successfully deleted.');
        }).catch((error) => {
            setMessage(error.message);
        })
    }

    /**A handler for the navigation buttons. */
    const onNavigateClick = (path) => {
        navigate(path);
    }

    /**Since our rows have an action column with buttons, this function handles
    * the generation of that cell, returning three buttons for view, edit and delete.
    */
    function generateActionsRow(item) {
        return (
            <Stack direction='row' >
                <IconButton
                    onClick={() => onNavigateClick(`/solve-quiz/${item.id}`)}
                >
                    <PsychologyAlt />
                </IconButton>
                <IconButton
                    onClick={() => onNavigateClick(`/quiz-form/${item.id}`)}
                >
                    <Edit />
                </IconButton>
                <IconButton
                    onClick={() => onDeleteClick(item)}
                >
                    <Delete />
                </IconButton>
            </Stack>
        )
    };

    /**For the list, we need only the ID and the name from the data 
     * we receive, and the we add the action object that is our 
     * function for generating the action buttons.
     */
    function generateListData(data) {
        return data?.map(item => {
            const { id, name } = item;
            return {
                id,
                name,
                actions: generateActionsRow
                    (
                        item,
                        onNavigateClick,
                        onDeleteClick
                    )
            }
        })
    };

    /**Once we get the data, we invoke the generateListData function, but we
     * also check is there is any, so in case of an error, there are no rows.
     */
    const listData = generateListData(data ?? []);

    const buttonProps = {
        text: "Add new Quiz",
        onClick: () => onNavigateClick('/quiz-form/new')
    };

    return (
        <ContentContainer
            title='All quizes'
            buttonProps={buttonProps}
            message={message}
            setMessage={setMessage}
            isLoading={isLoading}
            error={error}
        >
            <DataGrid
                columns={columns}
                hideFooter
                rows={listData}
                autoHeight
            />
        </ContentContainer>
    )
};

export default QuizzesOverviewPage;