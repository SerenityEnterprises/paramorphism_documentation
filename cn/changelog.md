# 更新日志

## 1.2-beta

- 修复了一个库目录不能在Windows下注册的问题。
- 添加配置值`name_generation.shuffle`以切换名称生成词典的随机排列顺序
//用于切换name生成字典的shuffling?

```yml
name_generation:
  shuffle: false # 关闭 shuffling(随机排列)
```

## 1.1-beta-修复

- 修正了在使用Inflation字典时重新映射的jar出现`verify error`
- 修复了使用策略“方法间接调用"(Method Call Indirection)或“字段间接访问”(Field Access Indirection)时的潜在冲突

## 1.1-beta

- Name generation (名称生成字典)现在的定义方式与前缀和后缀相同。

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

- **Hotfix:** 注释类中的方法不再重新映射.
- 随机种子可以使用“random_offset”配置条目进行更改.
- 名称生成词典现在已无序排列。启用/禁用此功能的方法将在1.2测试版中提供。
- 更新检查器被稍微调整了一下。
- 添加了一个新的策略: 字段间接访问（Field Access Indirection）它模糊了对外部类的字段读/写。

## 1.0-beta

重写，在文档更新之前，不建议从b0.14升级到1.0-beta。

- **重新映射现在更加强大**-几乎所有符合javaBean规范的应用程序现在都可以在不影响功能的情况下进行混淆
- 版本编号已经重新设定：b0.x已修正为1.x-beta。
- 现在可以使用maven来处理库。
- 混淆策略现在可以具有单独的masks:
- 现在支持每个元素类型的全局前缀和后缀
- 暂时删除了对自定义词典的支持
