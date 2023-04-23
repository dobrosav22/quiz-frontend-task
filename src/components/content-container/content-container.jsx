import React, { useEffect } from 'react';
import { Stack, Typography, Button, Snackbar, Skeleton, CircularProgress, styled } from '@mui/material';
import { PropTypes } from 'prop-types';

/**The page container styling. */
const PageContent = styled(Stack)(() => ({
    margin: '1rem',
}));

/**A dynamic width placeholder that 
 * shimmers as to indicate a loading state. 
 */
const Placeholder = styled(Skeleton)(({ theme }) => ({
    width: '50%',
    [theme.breakpoints.down('lg')]: {
        width: '100%'
    },
}));

const ChildrenContainer = styled(Stack)(({ theme }) => ({
    width: '50%',
    [theme.breakpoints.down('lg')]: {
        width: '100%'
    },
}));

/**A cointainer component to wrap other components into. Beside 
 * basic formatting, it holds the Container component for 
 * loading state and a Snackbar to pass messages into. 
 */
function ContentContainer(props) {

    const {
        title,
        buttonProps,
        message,
        setMessage,
        isLoading,
        error,
        children
    } = props;

    /**A handler for setting the message to an empty 
     * string and therefore closing the Snackbar.
     */
    const onAlertClose = () => {
        setMessage('')
    };

    /**Once the loading is finished, if there is an error, 
     * it is displayed in the Snackbar component. 
    */
    useEffect(() => {
        if (!isLoading && error) {
            setMessage(error.message)
        }
    }, [isLoading, error, setMessage]);

    const {
        text,
        onClick
    } = buttonProps;

    return (
        <PageContent
            alignItems={'center'}
            spacing={5}
        >
            {isLoading
                ? <CircularProgress />
                : <Typography
                    variant='h4'
                >
                    {title}
                </Typography>
            }
            <Button
                variant="contained"
                onClick={onClick}
                disabled={isLoading}
            >
                {text}
            </Button>
            <Snackbar
                open={!!message}
                autoHideDuration={4000}
                onClose={onAlertClose}
                message={message}
            />
            {isLoading
                ? <Placeholder
                    variant='rectangular'
                    height='10rem'
                />
                : <ChildrenContainer>
                    {children}
                </ChildrenContainer>
            }
        </PageContent>
    )

};

export default ContentContainer;

ContentContainer.propTypes = {
    /**The title for the content. */
    title: PropTypes.string,
    /**ButtonProps object with the text and click handler function. */
    buttonProps: PropTypes.shape(
        {
            text: PropTypes.string,
            onClick: PropTypes.func
        }
    ),
    /**Message for the Snacbar. */
    message: PropTypes.string,
    /**Setter function for the message, for the onClose handler. */
    setMessage: PropTypes.func.isRequired,
    /**Query hook loading state. */
    isLoading: PropTypes.bool.isRequired,
    /**Error object. */
    error: PropTypes.oneOfType(
        [
            PropTypes.oneOf([null]),
            PropTypes.shape(
                {
                    message: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                    stack: PropTypes.string,
                }
            ),
        ]
    ),
    /**The actuall content to be wrapped. */
    children: PropTypes.node.isRequired
};

ContentContainer.defaultProps = {
    title: 'Quiz project',
    message: ''
};