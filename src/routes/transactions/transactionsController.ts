import { Request, Response } from 'express';

export function listTransactions(req: Request, res: Response) {
    res.send('The list of transactions');
}

export function getTransactionById(req: Request, res: Response) {
    res.send('The transaction by id');
}

export function createTransaction(req: Request, res: Response) {
    res.send('The transaction created');
}

export function updateTransaction(req: Request, res: Response) {
    res.send('The transaction updated');
}

export function deleteTransaction(req: Request, res: Response) {
    res.send('The transaction deleted');
}