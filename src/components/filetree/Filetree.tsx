import React, { useEffect, useState } from "react"
import { fetchFiles } from "../../store/filetree/fileTreeSlice"
import { RootState } from "../../store/index"
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider, TreeItemIndex } from "react-complex-tree"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { renderers } from "./renderers"

const FileTree: React.FC = () => {
  const dispatch = useAppDispatch()
  const files = useAppSelector((state: RootState) => state.files.data)
  const [selectedFiles, setSelectedFiles] = useState<TreeItemIndex[]>([])

  useEffect(() => {
    dispatch(fetchFiles())
  }, [dispatch])

  const handleSelectFiles = (items: TreeItemIndex[]) => {
    setSelectedFiles(items)
    console.log("선택한 파일", items)
    items.forEach(index => {
      const selectedItem = files[index]
      if (selectedItem && selectedItem.isFolder) {
        console.log(`${index}는 폴더입니다. 폴더일경우에는 탭이 열리지 않음`)
      } else {
        console.log(`${index}는 파일입니다. 파일일경우에는 탭이 열림`)
      }
    })
  }
  const dataProvider = new StaticTreeDataProvider(files, (item, newName) => ({ ...item, data: newName }))
  console.log("데이터프로바이더가 뭘 전달하나", dataProvider)

  return (
    <UncontrolledTreeEnvironment<string>
      dataProvider={dataProvider}
      getItemTitle={item => item.data}
      viewState={{}}
      canDragAndDrop={true}
      canDropOnFolder={true}
      canReorderItems={true}
      canSearch={true}
      canRename={true}
      autoFocus={true}
      onSelectItems={handleSelectFiles}
      onRenameItem={(item, name) => alert(`${item.data} renamed to ${name}`)}
      {...renderers}
    >
      <div className="text-white">
        <Tree treeId="tree-1" rootItem="root" treeLabel="Tree example" />
      </div>
    </UncontrolledTreeEnvironment>
  )
}

export default FileTree
