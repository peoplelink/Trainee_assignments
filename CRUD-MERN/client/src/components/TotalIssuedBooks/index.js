import React from "react";
import { store } from "../../App";
import Axios from "axios";
import { useEffect, useState, useContext } from "react";
import AdminNav from "../AdminNav";

function TotalIssuedBooks() {


    const [token] = useContext(store)
    const [issuedBooksList, setBooksList] = useState([])
    const [loading, setLoading] = useState(true)
    console.log("...Available books...", issuedBooksList)

    useEffect(() => {
        setLoading(true)
        Axios.get('http://localhost:3000/totalIssuedBooks',
            {
                headers: {
                    'x-token': [localStorage.getItem("tokenLogin")]
                },
                contentType: "application/json"
            }
        )
            .then((res) => {
                setLoading(false)
                setBooksList(res.data);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error)
            })
    }, [token])

    return (
        <div className="flexRow fullHeight">
            <div className="flexAuto minWidthSideNav">
                {<AdminNav />}
            </div>
            <div className="flexMinWidthCol pdngHLG">
                <h1>issued books</h1>
                {loading && <h1>Loading...</h1>}
                {(!loading) && (issuedBooksList[0] !== undefined) ?
                    <ul className="booksListFlex">
                        {issuedBooksList.map((each) => <li className="flexRow goastBg borderRadius mrgnVLG" key={each._id}>
                            <div className="flexMinWidthCol pdngHLG mrgnVLG">
                                <div className="flexRow">
                                    <div className="flexMinWidthCol">
                                        <p>Book Name: {each.title}</p>
                                    </div>
                                    <div className="flexAuto">
                                        <p>Author : {each.author}</p>
                                    </div>
                                </div>
                                <div className="flexRow">
                                    <div className="flexMinWidthCol">
                                        <p>Year: {each.year}</p>
                                    </div>
                                    <div className="flexAuto">
                                        <p>Published by: {each.publication}</p>
                                    </div>
                                </div>
                                <div className="flexRow jcStart">
                                    <div className="flexAuto">
                                        <h4>Issued To: {each.issuedTo}</h4>
                                    </div>
                                </div>
                            </div>
                        </li>)}

                    </ul> : <h1>No book requests</h1>}
            </div>
        </div>
    )
}
export default TotalIssuedBooks
