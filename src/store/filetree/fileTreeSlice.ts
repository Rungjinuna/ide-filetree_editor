import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"

// 파일 및 폴더의 타입 정의
interface FileItem {
  index: string
  isFolder: boolean
  children?: string[]
  data: string
  content?: string // 폴더는 content가 없을 수 있음
}

// 파일 트리 상태의 타입 정의
interface FileTreeState {
  data: { [key: string]: FileItem }
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

// 초기 상태
const initialState: FileTreeState = {
  data: {},
  status: "idle",
  error: null
}

// 비동기적으로 파일 트리 데이터를 패치하는 액션
export const fetchFiles = createAsyncThunk("files/fetchFiles", async (_, { rejectWithValue }) => {
  try {
    console.log("Fetching files...")
    const response = await axios.get<{ [key: string]: FileItem }>("http://localhost:3001/files")
    console.log("Files fetched successfully")
    console.log(response.data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 이제 'error'는 'AxiosError' 타입으로 처리됩니다.
      console.error("Error fetching files:", error.message)
      // Axios 응답 본문에 접근하려면 error.response?.data를 사용하세요.
      return rejectWithValue(error.response?.data)
    } else {
      // 'error'가 AxiosError가 아닐 경우의 처리
      console.error("An unexpected error occurred:", error)
      // 'error'가 'unknown' 타입이므로, 여기서는 단순 문자열을 반환하거나 다른 처리를 할 수 있습니다.
      return rejectWithValue("An unexpected error occurred")
    }
  }
})

// 파일 추가 액션
export const addFile = createAsyncThunk("files/addFile", async (fileData: FileItem) => {
  try {
    console.log("Adding a file...")
    const response = await axios.post<FileItem>("http://localhost:3001/files", fileData)
    console.log("File added successfully")
    return response.data
  } catch (error: any) {
    console.error("Error adding a file:", error.message)
    throw error
  }
})

// 폴더 추가 액션
export const addFolder = createAsyncThunk("files/addFolder", async (folderData: FileItem) => {
  try {
    console.log("Adding a folder...")
    const response = await axios.post<FileItem>("http://localhost:3001/files", folderData)
    console.log("Folder added successfully")
    return response.data
  } catch (error: any) {
    console.error("Error adding a folder:", error.message)
    throw error
  }
})

const fileTreeSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<string>) => {
      const newFile: FileItem = {
        index: uuidv4(), // uuid로 고유한 index 생성
        isFolder: false,
        data: action.payload,
        content: "" // 새 파일의 기본 내용
      }
      state.data[newFile.index] = newFile // 새 파일을 상태에 추가
      console.log("File added:", newFile) // 추가된 파일 확인
    },
    addFolder: (state, action: PayloadAction<string>) => {
      const newFolder: FileItem = {
        index: uuidv4(), // uuid로 고유한 index 생성
        isFolder: true,
        data: action.payload,
        children: []
      }
      state.data[newFolder.index] = newFolder // 새 폴더를 상태에 추가
      console.log("Folder added:", newFolder) // 추가된 폴더 확인
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFiles.pending, state => {
        console.log("Fetching files started")
        state.status = "loading"
      })
      .addCase(fetchFiles.fulfilled, (state, action: PayloadAction<{ [key: string]: FileItem }>) => {
        console.log("Fetching files succeeded")
        state.status = "succeeded"
        state.data = action.payload
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        console.error("Fetching files failed", action.error.message)
        state.status = "failed"
        state.error = action.error.message || null
      })
  }
})

export default fileTreeSlice.reducer
