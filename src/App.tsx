/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { auth, db, signInAnon } from './lib/firebase';
import { collection, doc, getDocs, setDoc, serverTimestamp, query, limit } from 'firebase/firestore';
import { generateContentWithAI } from './lib/ai';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    isAnonymous?: boolean;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [markdown, setMarkdown] = useState('');
  const [previewMode, setPreviewMode] = useState<'html' | 'text'>('html');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await signInAnon();
        setUserId(user.uid);
      } catch (err) {
        setError('Failed to authenticate anonymously.');
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadDocument = async () => {
      try {
        const draftsRef = collection(db, `documents/${userId}/drafts`);
        const q = query(draftsRef, limit(1));
        let querySnapshot;
        try {
          querySnapshot = await getDocs(q);
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, `documents/${userId}/drafts`);
          return;
        }

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setDocId(docData.id);
          setMarkdown(docData.data().content || '');
        } else {
          // Create a new draft
          const newDocRef = doc(draftsRef);
          setDocId(newDocRef.id);
          const initialContent = '# Welcome to Markdown Converter\n\nStart typing here...';
          try {
            await setDoc(newDocRef, {
              content: initialContent,
              updatedAt: serverTimestamp(),
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, newDocRef.path);
            return;
          }
          setMarkdown(initialContent);
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load document.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [userId]);

  // Auto-save with debounce
  useEffect(() => {
    if (!userId || !docId || isLoading) return;

    const handler = setTimeout(async () => {
      setIsSaving(true);
      try {
        const docRef = doc(db, `documents/${userId}/drafts/${docId}`);
        await setDoc(docRef, {
          content: markdown,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `documents/${userId}/drafts/${docId}`);
        } catch (e) {
          console.error('Failed to save document:', e);
        }
      } finally {
        setIsSaving(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [markdown, userId, docId, isLoading]);

  const handleGenerateAI = async () => {
    const prompt = window.prompt("What would you like the AI to generate? (e.g., 'Write a markdown guide on React')");
    if (!prompt) return;

    setIsGeneratingAI(true);
    try {
      const generatedText = await generateContentWithAI(prompt);
      setMarkdown((prev) => prev ? `${prev}\n\n${generatedText}` : generatedText);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "An error occurred while generating content");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 font-medium max-w-2xl p-4 bg-white rounded shadow whitespace-pre-wrap break-words">
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500 font-medium animate-pulse">Loading document...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <Toolbar 
        markdown={markdown} 
        previewMode={previewMode} 
        setPreviewMode={setPreviewMode} 
        isSaving={isSaving} 
        onGenerateAI={handleGenerateAI}
        isGeneratingAI={isGeneratingAI}
      />
      <div className="flex flex-1 overflow-hidden">
        <Editor value={markdown} onChange={setMarkdown} />
        <Preview markdown={markdown} mode={previewMode} />
      </div>
    </div>
  );
}
