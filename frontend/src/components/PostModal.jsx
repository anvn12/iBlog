import { useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const TINYMCE_API = import.meta.env.VITE_TINYMCE_API;

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};


function PostModal({
    modalTitle = "New Post",
    isOpen = false,
    setIsOpen,
    postTitle = "",
    postContent = "",
    published = true,
    setPostTitle,
    setPostContent,
    setPublished,
    targetFunction,
    validationErrors
}) {
    const editorRef = useRef(null);

    function closeModal() {
        setIsOpen(false);
    }

    function handleChangePostTitle(event) {
        setPostTitle(event.target.value);
    }
    function handleChangePostContent(value) {
        setPostContent(value);
    }
    function handleChangePublished(event) {
        setPublished(event.target.value);
    }

    function getFieldError(fieldName) {
        return validationErrors
            .filter((error) => error.path === fieldName)
            .map((error, i) => (
                <p key={i} role="alert" style={{ color: "red" }}>
                    {error.msg}
                </p>
            ));
    }


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Post Modal"
        >
            <div>
                <button onClick={closeModal}>Cancel</button>
                <h2>{modalTitle}</h2>
            </div>

            <div>
                <div>
                    {getFieldError("title")}
                    <label htmlFor="title">Title: </label>
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        id="title"
                        value={postTitle}
                        onChange={handleChangePostTitle}
                    />
                </div>

                <div>
                    <Editor
                        apiKey={TINYMCE_API}
                        onInit={(evt, editor) => editorRef.current = editor}
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size:14px }',
                            branding: false,
                            placeholder: 'Content',
                        }}
                        value={postContent}
                        onEditorChange={handleChangePostContent}
                    />
                </div>

                <div>
                    <label htmlFor="published">Is published: </label>
                    <select
                        name="published"
                        id="published"
                        defaultValue={published}
                        onChange={handleChangePublished}
                    >
                        <option value="true" >True</option>
                        <option value="false">False</option>
                    </select>
                </div>
            </div>

            {postTitle.length === 0 ? (
                <button onClick={targetFunction} disabled>Post</button>
            ) : (
                <button onClick={targetFunction}>Post</button>
            )}
        </Modal>
    )
}

export default PostModal;