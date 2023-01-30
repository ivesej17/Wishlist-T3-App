import { faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure } from '@headlessui/react';
import { WishlistItemComment } from '@prisma/client';
import { useState } from 'react';
import { api } from '../utils/api';
import { getCurrentDateISO } from '../utils/time-utils';

const WishlsitItemComments: React.FC<{ wishlistItemID: number }> = (props) => {
    const { data, isLoading, error } = api.wishlistItemComments.get.useQuery(props.wishlistItemID, {
        onSuccess: (data) => {
            console.log('comments retrieved for id', props.wishlistItemID, ':', data);
        },
    });

    const submitComment = api.wishlistItemComments.create.useMutation();

    const deleteComment = api.wishlistItemComments.delete.useMutation();

    const [comment, setComment] = useState('');

    const submitCommentClick = async () => {
        const newComment: Omit<WishlistItemComment, 'id'> = {
            comment: comment,
            createdAt: getCurrentDateISO(),
            updatedAt: getCurrentDateISO(),
            wishlistItemID: props.wishlistItemID,
            byUser: 'Elliott',
        };

        const createdComment = await submitComment.mutateAsync(newComment);

        data?.push(createdComment);
    };

    const deleteCommentClick = async (commentID: number) => {
        await deleteComment.mutateAsync(commentID);

        data?.splice(
            data.findIndex((comment) => comment.id === commentID),
            1
        );
    };

    if (!data || isLoading) return <div>Loading...</div>;

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
                <Disclosure as="div" className="w-full">
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-green-200 px-4 py-2 text-left text-sm font-medium text-black hover:bg-green-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                <span>Comments</span>
                                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 18, color: 'black' }} />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                <>
                                    {data.length === 0 && <div className="w-full text-center">Looks like there are no comments here!</div>}

                                    {data.length > 0 &&
                                        data.map((comment) => {
                                            return (
                                                <div className="flex w-full flex-row items-center justify-between">
                                                    <div className="mb-3 flex w-full flex-col" key={comment.id}>
                                                        <div className="flex flex-row items-center">
                                                            <div className="font-bold">{comment.byUser}</div>
                                                            <div className="ml-2 text-xs text-gray-500">
                                                                {comment.createdAt.toLocaleDateString()} - {comment.createdAt.toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                        <div className="ml-2">{comment.comment}</div>
                                                        <hr className="w-full border border-slate-200"></hr>
                                                    </div>

                                                    <button className="cursor-pointer" onClick={() => deleteCommentClick(comment.id)}>
                                                        <FontAwesomeIcon icon={faTrash} style={{ fontSize: 18, color: 'red' }} />
                                                    </button>
                                                </div>
                                            );
                                        })}

                                    <div className="mt-3 w-full">
                                        <input type="text" className="form-input-alt" onChange={(event) => setComment(event.target.value)}></input>
                                    </div>

                                    <button
                                        className="float-right mt-3 flex justify-between rounded-lg bg-green-50 px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-green-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                                        onClick={() => submitCommentClick()}
                                    >
                                        <span>Submit Comment</span>
                                    </button>
                                </>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </div>
    );
};

export default WishlsitItemComments;
