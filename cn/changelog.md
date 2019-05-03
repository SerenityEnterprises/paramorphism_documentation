# 更新日志

## 1.2-beta

- 修复了 Windows系统 下资源库目录不被加载的问题
- 增加了一个新的值 `name_generation.shuffle` 用于混淆 名称生成词典(name generation dictionaries)

```yml
name_generation:
  shuffle: false # 关闭
```

## 1.1-beta-hotfix

- 修正了在使用Inflation字典时重新映射的jar出现`verify error`
- 修复了使用策略“方法间接调用"(Method Call Indirection)或“字段间接访问”(Field Access Indirection)时的潜在冲突

## 1.1-beta

- 名称生成词典(name generation dictionaries) 目前可以定义前缀和后缀

```yml
# 旧:
name_generation:
  dictionaries:
    - alphabet
    - classes
    - alphabet
    - alphabet

# 新:
name_generation:
  dictionaries:
    all: alphabet
    classes: enterprise
```

- **Hotfix:** 注释类中的方法不再重命名
- 可以使用 `random_offset`值 来更改确定性随机种子。
- 名称生成词典(name generation dictionaries) 将会被混淆. 开启/关闭的方法 将会推出在 1.2-beta 版本.
- 对检查更新程序稍作修改
- 新策略：Field Access Indirection，它模糊了对外部类的字段读/写。

## 1.0-beta

这是一个 **完全** 的重写. 在文档更新之前，不建议从b0.14升级到1.0-beta


重写，在文档更新之前，不建议从b0.14升级到1.0-beta。

- **重新映射现在更加强大**-几乎所有符合javaBean规范的应用程序现在都可以在不影响功能的情况下进行混淆
- 版本编号已经重新设定：b0.x已修正为1.x-beta。
- 现在可以使用maven来处理库。
- 混淆策略现在可以具有单独的masks:
- 现在支持每个元素类型的全局前缀和后缀
- 暂时删除了对自定义词典的支持
