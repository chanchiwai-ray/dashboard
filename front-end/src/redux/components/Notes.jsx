import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col } from "react-bootstrap";
import Note from "../../components/Note/Note.jsx";
import { selectAuth, selectNotes } from "../app/store";
import { getNotes, putNote } from "../slices/notes";

export default () => {
  const auth = useSelector(selectAuth);
  const notes = useSelector(selectNotes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getNotes({
        userId: auth.value.userId,
      })
    );
  }, []);

  return (
    <Row>
      {notes.success
        ? notes.value
            .filter((note) => note.star)
            .sort((x, y) => x.title > y.title)
            .map((note) => (
              <Col xs={12} className="my-2" key={note._id}>
                <Note
                  item={note}
                  onDone={(data) => {
                    dispatch(putNote({ id: note._id, userId: auth.value.userId, data: data }));
                  }}
                  onDelete={() => dispatch(deleteTask({ userId: auth.value.userId, id: note._id }))}
                  onCancel={() => null}
                />
              </Col>
            ))
        : notes.message}
    </Row>
  );
};
